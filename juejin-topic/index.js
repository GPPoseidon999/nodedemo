const axios = require('axios')
const Table = require('cli-table3')
const { format } = require('date-fns')
const drawInIterm = require('iterm2-image')
const url = `https://web-api.juejin.im/query`

let list = []
// 请求数据
async function getListData() {
    const resp = await axios.post(
        url,
        {
            operationName: '',
            query: '',
            variables: { size: 20, after: '', afterPosition: '' },
            extensions: { query: { id: '249431a8e4d85e459f6c29eb808e76d0' } },
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

    if (resp.data.data.recommendedActivityFeed.items) {
        const data = resp.data.data.recommendedActivityFeed.items
        if (data.edges) {
            const dataList = data.edges.map((item) => {
                return {
                    username: item.node.actors[0].username,
                    avatar: item.node.actors[0].avatarLarge,
                    content: item.node.targets[0].content,
                    time: item.node.targets[0].updatedAt,
                    pictures: item.node.targets[0].pictures,
                }
            })
            list = list.concat(dataList)
        }
        if (data.pageInfo) {
            ;(hasNext = data.pageInfo.hasNextPage), (endCursor = data.pageInfo.endCursor)
        }
    }
}

function createTable() {
    const table = new Table({
        head: ['用户昵称', '沸点内容', '最后更新时间'],
        colWidths: [30, 140, 30],
    })
    if (list.length > 0) {
        for (const item of list) {
            const time = format(new Date(item.time), 'yyyy-MM-dd HH:mm:ss')
            table.push([item.username, item.content, time])
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
