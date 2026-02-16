
export const MenuUtil = {
    getMenuItems() {
        return [
            {
                label: 'Ekipman',
                route: '/equipment'
            },
            {
                label: 'Ekipman Bakımı',
                route: '/maintenance'
            },
            {
                label: 'Tarla',
                route: '/field'
            },
            {
                label: 'Tarla işlemleri (Masraf)',
                route: '/action-taken'
            },
            {
                label: 'Alınan Ürünler (Masraf)',
                route: '/received-product'
            },
            {
                label: 'Satılan Ürünler (Satış)',
                route: '/selled-product'
            },
            {
                label: 'Envanter',
                route: '/inventory'
            },
        ];
    },
};

