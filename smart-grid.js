var smartgrid = require('smart-grid');
 
/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'sass', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '1%', /* gutter width px || % */
    container: {
        maxWidth: '980px', /* max-width оn very large screen */
        fields: '10px' /* side fields */
    },
    breakPoints: {
        lg: {
            'width': '980px', /* -> @media (max-width: 1100px) */
            'fields': '10px' /* side fields */
        },
        md: {
            'width': '980px',
            'fields': '10px'
        },
        sm: {
            'width': '770px',
            'fields': '10px'
        },
        xs: {
            'width': '480px',
            'fields': '10px'
        }
        /* 
        We can create any quantity of break points.
 
        some_name: {
            some_width: 'Npx',
            some_offset: 'N(px|%)'
        }
        */
    }
};
 
smartgrid('./app/sass/mixin', settings);