module.exports = {
  hooks: {
    readPackage: (pkg, context) => {
      if (pkg.name === 'react-router-dom') {
        /**
         * Hack to fix dependency issue in webcert application with pnpm. connected-react-router has a
         * peerDependency on react-router@^5 and react-router has a dependency on react-router@5.2.0.
         * With a regular package manager such as npm or yarn this would be resolved since packages are flattened, so
         * connected-react-router's dependency get's resolved by react-router-dom's dependency on react-router.
         *
         * With pnpm this will however not work, connected-react-router will expect webcert to
         * supply react-router and react-router-dom will have it's own version.
         *
         * connected-react-router 6.9.3
         * └── react-router 5.2.0 peer     # linked to webcert react-router
         * react-router 5.2.0              # package from webcert
         * react-router-dom 5.2.0
         * └── react-router 5.2.0          # react-router-dom has it's own package
         *
         * To solve this we make react-router-dom also use webcert version of react-router:
         */
        if (pkg.version === '5.2.0') {
          pkg.peerDependencies['react-router'] = pkg.dependencies['react-router']
          delete pkg.dependencies['react-router']
        }
      }
      return pkg
    },
  },
}
