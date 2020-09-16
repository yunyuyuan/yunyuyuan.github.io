export default {
    changeMd(state, file) {
        state.mdFile = file
    },
    initConfig(state) {
        fetch('/config.json').then(res => {
            res.text().then(res => {
                state.config = JSON.parse(res)
            })
        })
    }
}