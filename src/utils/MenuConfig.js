const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: 'home',
    },
    {
        title: '文章管理',
        key: '/blog',
        icon: 'hdd',
        children: [
            {
                title: '文章发布',
                key: '/blog/articlerelease',
            },
            {
                title: '标签管理',
                key: '/blog/tag',
            },
            {
                title: '文章管理',
                key: '/blog/article',
            }
        ]
    },
    {
        title: '个人中心',
        key: '/user',
        icon: 'user'
    },
];
export default menuList;