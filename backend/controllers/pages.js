const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const request = require("request");
const Page = require("../models/page");
const User = require("../models/user");

const getPages = async (req, res, next) => {
  const userId = req.userId;

  try {
    if (!userId) {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }

    const user = await User.findById(userId);

    if (!user) {
      const err = new Error("Could not find user by id.");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      message: "Fetched pages successfully.",
      pages: user.pages.map((page) => page.toString()),
    });
  } catch (err) {
    next(err);
  }
};

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const getMetaData = async (req, res, next) => {
  try {
    const url = req.body.url;

    let title;
    if (isValidHttpUrl(url)) {
      request(url, function (error, response, body)
      {
        if (error) {
          console.log(error);
          return
        }
        var $ = cheerio.load(body);
        // in this $ variable we can find the hostname and uri stuff
        const { protocol, hostname, pathname } = new URL(url);
        title = $("title").text();
        res.status(200).json({
          message: "Got title",
          title: title,
          protocol: protocol,
          hostname: hostname,
          pathname: pathname,
        });
      });
    } else {
      res.status(200).json({
        message: "Not a good URL",
        title: "",
        protocol: "",
        hostname: "",
        pathname: "",
      });
    }
  } catch (err) {
    next(err);
  }
}

// get a page that already exists
const getPage = async (req, res, next) => {
  let userId = req.userId;
  const pageId = req.params.pageId;
  let creatorId;
  try {
    const page = await Page.findById(pageId);
    if (!page) {
      const err = new Error("Could not find page by id.");
      err.statusCode = 404;
      throw err;
    }

    if ( page.creatorId){
      creatorId = page.creator.toString();
    } else {
      creatorId = null;
    }

      res.status(200).json({
        message: "Fetched page successfully.",
        page: page,
      });
  } catch (err) {
    next(err);
  }
};

// create page for the first time
const postPage2 = async (req, res, next) => {
  const userId = req.body.userId;
  const blocks = req.body.blocks;
  const page = new Page({
    blocks: blocks,
    creator: userId || null,
    ispublic: true,
  });
  try {
    const savedPage = await page.save();

    // Update user collection too
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        const err = new Error("Could not find user by id.");
        err.statusCode = 404;
        throw err;
      }
      user.pages.push(savedPage._id);
      await user.save();
    }

    res.status(201).json({
      message: "Created page successfully.",
      page: savedPage,
    });
  } catch (err) {
    next(err);
  }
};

// create page for the first time
const postPage = async (req, res, next) => {
  const userId = req.body.userId;
  const blocks = req.body.blocks;
  if (!req.body.userId) {
    const err = new Error("User id is empty.");
    err.statusCode = 404;
    next(err);
  }
  const page = new Page({
    blocks: blocks,
    creator: userId || null,
    ispublic: true,
  });
  try {
    const savedPage = await page.save();

    // Update user collection too
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        const err = new Error("Could not find user by id.");
        err.statusCode = 404;
        throw err;
      }
      user.pages.push(savedPage._id);
      await user.save();
    }

    res.status(201).json({
      message: "Created page successfully.",
      pageId: savedPage._id.toString(),
      blocks: blocks,
      creator: userId || null,
    });
  } catch (err) {
    next(err);
  }
};

// i think this is update page
const putPage = async (req, res, next) => {
  const userId = req.body.userId;
  const pageId = req.params.pageId;
  const blocks = req.body.blocks;

  try {
    const page = await Page.findById(pageId);

    if (!page) {
      const err = new Error("Could not find page by id.");
      err.statusCode = 404;
      throw err;
    }

    // Public pages have no creator, they can be updated by anybody
    // For private pages, creator and logged-in user have to be the same
    const creatorId = page.creator ? page.creator.toString() : null;
    if ((creatorId && creatorId === userId) || !creatorId) {
      page.blocks = blocks;
      const savedPage = await page.save();
      res.status(200).json({
        message: "Updated page successfully.",
        page: savedPage,
      });
    } else {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const deletePage = async (req, res, next) => {
  const userId = req.userId;
  const pageId = req.params.pageId;
  try {
    const page = await Page.findById(pageId);

    if (!page) {
      const err = new Error("Could not find page by id.");
      err.statusCode = 404;
      throw err;
    }

    // Public pages have no creator, they can be deleted by anybody
    // For private pages, creator and logged-in user have to be the same
    const creatorId = page.creator ? page.creator.toString() : null;
    if ((creatorId && creatorId === userId) || !creatorId) {
      const deletedPage = await Page.findByIdAndDelete(pageId);

      // Update user collection too
      if (creatorId) {
        const user = await User.findById(userId);
        if (!user) {
          const err = new Error("Could not find user by id.");
          err.statusCode = 404;
          throw err;
        }
        user.pages.splice(user.pages.indexOf(deletedPage._id), 1);
        await user.save();
      }

      // Delete images folder too (if exists)
      const dir = `images/${pageId}`;
      fs.access(dir, (err) => {
        // If there is no error, the folder does exist
        if (!err && dir !== "images/") {
          fs.rmdirSync(dir, { recursive: true });
        }
      });

      res.status(200).json({
        message: "Deleted page successfully.",
      });
    } else {
      const err = new Error("User is not authenticated.");
      err.statusCode = 401;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const postImage = (req, res, next) => {
  if (req.file) {
    const imageUrl = req.file.path;
    res.status(200).json({
      message: "Image uploaded successfully!",
      imageUrl: imageUrl,
    });
  } else {
    const error = new Error("No image file provided.");
    error.statusCode = 422;
    throw error;
  }
};

const deleteImage = (req, res, next) => {
  const imageName = req.params.imageName;
  if (imageName) {
    const imagePath = `images/${imageName}`;
    clearImage(imagePath);
    res.status(200).json({
      message: "Deleted image successfully.",
    });
  } else {
    const error = new Error("No imageName provided.");
    error.statusCode = 422;
    throw error;
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.getPages = getPages;
exports.getPage = getPage;
exports.getMetaData = getMetaData;
exports.postPage = postPage;
exports.postPage2 = postPage2;
exports.putPage = putPage;
exports.deletePage = deletePage;
exports.postImage = postImage;
exports.deleteImage = deleteImage;
