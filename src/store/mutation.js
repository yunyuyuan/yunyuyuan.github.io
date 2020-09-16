export default {
    changeMd(state, file) {
        state.mdFile = file
    },
    initGitUtil(state, githubUtils) {
        state.gitUtil = githubUtils
    },
    initConfig(state, config) {
        state.config = config
    }
}