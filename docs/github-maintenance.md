# GitHub maintenance

Maintain an intentionally small public repository with no deployment workflows or credentials. CI validates local links, JSON/schema structure and public export boundaries. Dependabot checks GitHub Actions. CODEOWNERS routes review to the current maintainer.

Recommended `main` protection: require a pull request, passing `public-checks` CI, dismiss stale approvals, disallow force pushes and branch deletion. Keep a trusted-maintainer bypass for urgent maintenance; encourage signed commits without requiring them initially. A sole maintainer should not be required to approve their own PR.

Administrative checklist (verify actual settings in GitHub; this file is not evidence they are enabled):

- [ ] Enable private vulnerability reporting and verify the private reporting form.
- [ ] Enable secret scanning and push protection where available.
- [ ] Enable dependency alerts and security updates where applicable.
- [ ] Protect `main` with the posture above after initial publication and first CI run.
- [ ] Confirm public visibility, homepage, description and discovery topics.
- [ ] Review collaborator access and keep the private server repository private.
- [ ] Add repository links to the live website/discovery in a separately validated service change.

Never push production history here. For public exports, review all files and their Git history. Deleting files or replacing branch history does not revoke credentials or guarantee removal from forks, caches or old object URLs. Investigate and rotate exposed credentials before relying on cleanup.
