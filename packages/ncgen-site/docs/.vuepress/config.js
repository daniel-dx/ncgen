module.exports = {
  base: '/ncgen/',
  locales: {
    // The key is the path for the locale to be nested under.
    // As a special case, the default locale can use '/' as its path.
    "/": {
      lang: "English", // this will be set as the lang attribute on <html>
      title: "ncgen",
      description: "A very nice code generator"
    },
    "/zh/": {
      lang: "简体中文",
      title: "ncgen",
      description: "一个令人愉悦的代码生成器"
    }
  },
  themeConfig: {
    sidebar: 'auto',
    selectText: "Languages",
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "Config", link: "/config/" },
      { text: "API", link: "/api/" }
    ],
    repo: 'daniel-dx/ncgen',

    locales: {
      "/zh/": {
        selectText: "选择语言",
        nav: [
          { text: "指南", link: "/zh/guide/" },
          { text: "配置", link: "/zh/config/" },
          { text: "API", link: "/zh/api/" }
        ]
      }
    }
  }
};
