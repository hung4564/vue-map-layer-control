/* eslint-disable no-console */
(async () => {
  try {
    const { execa } = await import("execa");
    await execa("git", ["checkout", "--orphan", "gh-pages"]);
    console.log("Building started...");
    await execa("NODE_ENV=webproduction", ["npm", "run", "build:web"], {
      stdio: "inherit"
    });
    await execa("git --work-tree dist add --all");
    await execa('git --work-tree dist commit -m "gh-pages"');
    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    await execa(`git checkout -f master`);
    await execa("git branch -D gh-pages");
    console.log("Successfully deployed, check your settings");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.message);
    process.exit(1);
  }
})();
