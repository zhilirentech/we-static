seajs.config({
    alias:{
        /* we */
        'we':'rc/config/we',
        'rcinit':'rc/init/rcinit',
        'utils':'rc/utils/utils',
        'login':'rc/action/login/1.0.0/login',
        'ajax':'rc/plugins/ajax/1.0.0/ajax',
        'dialog':'rc/plugins/dialog/1.0.0/dialog',
        'fixpng':'rc/plugins/fixpng/1.0.0/fixpng',
        'navtab':'rc/plugins/navtab/1.0.0/navtab',
        'page':'rc/plugins/page/1.0.0/page',
        'pagination':'rc/plugins/pagination/1.0.0/pagination',
        'placeholder':'rc/plugins/placeholder/1.0.0/placeholder',
        'scrollbar':'rc/plugins/scrollbar/1.0.0/scrollbar',
        'select':'rc/plugins/select/1.0.0/select',
        'slides':'rc/plugins/slides/1.0.0/slides',
        'stock':'rc/plugins/stock/1.0.0/stock',
        'tab':'rc/plugins/tab/1.0.0/tab',
        'table':'rc/plugins/table/1.0.0/table',
        'theme':'rc/plugins/theme/1.0.0/theme',
        'tree':'rc/plugins/tree/1.0.0/tree',
        'iconfig':'rc/config/config',
        'chart':'we/plugins/chart/1.0.0/chart',
    },
    paths: {
    	 manage: weFileLoader.root + '/rc/manage',
    	 rc: weFileLoader.root + '/rc/common/js/we'
    },
    debug:true,
    preload:[ 'rcinit'],
    charset:'utf-8'
});
seajs.use('rcinit');