export default {
    changeMd(state, file) {
        state.nowMdFile = file
    },
    updateConfig(state, config) {
        state.config = config
    },
    updateGitUtil(state, githubUtils) {
        state.gitUtil = githubUtils
    },
}