var express = require('express');
var marked = require('marked');
var fs = require('fs');
var path = require('path');

var router = express.Router();

function titleCase(str) {
  str = str.split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

function generateTitle(name) {
  console.log(name)
  var arr = name.replace('.md', '').split('-');
  var newName = '';
  for (word of arr) {
    newName += titleCase(word) + ' '
  }
  return newName.trim();
}

function getNav() {
  var pages = path.join(process.cwd(), 'pages');
  var pageNames = fs.readdirSync(pages); // get all filenames from pages/
  var navigation = [];
  // remove .md for each page
  for (var page of pageNames) {
    navigation.push({
      title: generateTitle(page),
      url: path.join('/pages', page.replace('.md', '')),
    })
  }
  return navigation;
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express', pages: getNav() });
});

router.get('/pages/:pageName', function(req, res) {
  getNav();
  var pageName = req.params.pageName;
  var pathName = path.join(process.cwd(), 'pages', pageName + '.md');
  console.log('>Attempting to load', pathName);
  if (fs.existsSync(pathName)) {
    console.log('> file found. rendering');
    var data = fs.readFileSync(pathName);
    var parsed = marked(data.toString());
    res.render('main-page', { content: parsed  });
  } else {
    console.log('> file not found. rendering 404');
    res.render('four-oh-four');
  }
});

module.exports = router;
