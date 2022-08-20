module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/styles");

  eleventyConfig.setTemplateFormats([
    "njk",
    "md",
    "png",
  ]);

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
    markdownTemplateEngine: 'njk',
  }
}
