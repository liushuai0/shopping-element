//test
export const increment = ({commit}) => {
    commit('INCREMENT')
}
export const decrement = ({commit}) => {
    commit('DECREMENT')
}

// import {reqUserList} from "../api/index";
// export default {
//     // 异步获取用户信息
//     async getUserList ({commit}) {
//         const result = await reqUserList()
//         if (result.code === 0) {
//             console.log(result)
//             // const userInfo = result.data
//             // commit(RECEIVE_USER_INFO, {userInfo})
//         }
//     },
// }
