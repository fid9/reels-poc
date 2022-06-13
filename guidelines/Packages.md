## Package Management

### Principles

**Reproducibility**: We should make use of techniques to assure the package version is identical and performs equally on all environments.

**Safety**: The security of the package should be assessed before using it. A protocol should be in place to ensure production always has safe packages.

**Reliability**: The packages we choose should be alive, well supported, and widely used. Their trackers should be well maintained.

**License**: The licenses we can use are MIT or compatible. (A)GPL should be avoided or cleared by the client.

**Future-proof-ness**: Packages should always available. Do not rely on 3rd party package managers (even GitHub).

**Leanness**: Small packages are always better than larger ones. Trivial packages are almost never ok.

**Cutting-Edge vs Well-Established**: New projects should avoid using too many unknown technologies.

###  Choosing a package

- Use official packages for services. 3rd party packages need to be vetted.
- Refer to the Engineering Guidelines for vetted packages. These should also contain tips and guidelines.
- Avoid the un-maintained. Check Issue trackers if there are any old bugs that are unsolved or unanswered.
- Avoid the un-used. Check that the package has a relatively high usage (download) rate.
- Avoid the deprecated. Check that a package was not dropped by the author.

### Isolate the package (does not apply for frameworks)

- Make a thin wrapper around the package. (Check if the Guidelines or the Seed has one provided)
- The package should be replaceable, mockable, and testable.

### Document the package

- If the package has special instructions or set up requirements, include them in the readme file.
