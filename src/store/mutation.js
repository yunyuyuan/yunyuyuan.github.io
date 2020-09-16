export default {
    changeMd(state, file) {
        state.mdFile = file
    },
    updateGitUtil(state, githubUtils) {
        state.gitUtil = githubUtils
    },
    initConfig(state, config) {
        state.config = config
    }
}