const proptype = { variant: ['', 'text', 'contained', 'outlined'], size: ['', 'small', 'medium', 'large'], color:['', 'primary', 'secondary', 'success', 'error'], disabled:['', 1]}

export default function Controls(){
    return [
        {
            name: 'Button',
            properties: {content:'', ...proptype}
        },
        {
            name: 'ButtonGroup',
            properties: {...proptype, content:''}
        },
        {
            name: 'Switch',
            properties: proptype
        },
        {
            name: 'Select',
            properties: proptype
        },
        {
            name: 'Slider',
            properties: proptype
        },
        {
            name: 'Checkbox',
            properties:  {checked:'', ...proptype}
        },
    ]
}