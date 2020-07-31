const axios = require('axios')
const Table = require('cli-table3')
const { format } = require('date-fns')
const drawInIterm = require('iterm2-image')
const url = `https://apinew.juejin.im/recommend_api/v1/short_msg/recommend`

let list = []
// 请求数据
async function getListData() {
    const resp = await axios.post(
        url,
        {
            id_type: 4,
            sort_type: 300,
            cursor: '0',
            limit: 20,
        },
        {
            headers: {
                Referer: 'https://juejin.im/pins',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36',
                'X-Agent': 'Juejin/Web',
            },
        }
    )
    if (resp.data.data.length > 0) {
        const data = resp.data.data
        const dataList = data.map((item) => {
            return {
                username: item.author_user_info.user_name,
                avatar: item.author_user_info.avatar_large,
                content: item.msg_Info.content,
                pictures: item.msg_Info.pic_list,
            }
        })
        list = list.concat(dataList)
    }
}

function createTable() {
    const table = new Table({
        head: ['用户昵称', '沸点内容'],
        colWidths: [30, 160],
    })
    if (list.length > 0) {
        for (const item of list) {
            table.push([item.username, item.content])
        }
    }
    console.log(table.toString())
}

async function main() {
    await getListData()
    createTable()
}

main()
//  终端显示图片
// var https = require('https')

// var img =
//     'https://user-gold-cdn.xitu.io/2020/7/29/1739a01f14da8c11?w=753&h=399&f=jpeg&s=106450&w=753&h=399'

// https.get(img, function (res) {
//     console.log(res.statusCode)
//     if (res.statusCode === 200) {
//         drawInIterm(res, function (err) {
//             if (err) {
//                 throw err
//             }
//             console.log('done!')
//         })
//     }
// })
