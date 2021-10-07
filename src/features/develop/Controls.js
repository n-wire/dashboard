const proptype = { variant: ['', 'text', 'contained', 'outlined'], size: ['', 'small', 'medium', 'large'], color:['', 'primary', 'secondary', 'success', 'error'], disabled:['', 1]}

export default function Controls(){
    return [
        {
            name: 'Button',
            tag: 'Button',
            properties: {content:'', ...proptype}
        },
        {
            name: 'ButtonGroup',
            template: `<ButtonGroup variant="contained" aria-label="outlined primary button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
</ButtonGroup>`,
            properties: {}
        },
        {
            name: 'Radio',
            tag: 'FormControlLabel',
            properties: {value:'', label:'label', control:[`component:{Type:'Radio'}`]}
        },
        {
            name: 'RadioGroup',
            template:`<FormControl component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
            aria-label="gender"
            defaultValue="female"
            name="radio-buttons-group"
            row = "expr:0"
            value="expr:value"
            onChange="action:value=__args[1].target.value"
        >
            <FormControlLabel value="female" control="component:{Type:'Radio'}" label="Female" />
            <FormControlLabel value="male" control="component:{Type:'Radio'}" label="Male" />
            <FormControlLabel value="other" control="component:{Type:'Radio'}" label="Other" />
        </RadioGroup>
</FormControl>`
        },
        {
            name: 'Switch',
            tag: 'FormControlLabel',
            properties: {control:["component:{Type:'Switch', defaultChecked:'1'}"], label:"label", checked:'expr:value', onChange:'action:value=__args[0].target.checked',
             color:['', 'primary', 'secondary', 'success', 'error']}
        },
        {
            name: 'Select',
            template: `<FormControl fullWidth="1">
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
              value="expr:age or ''"
              label="Age"
              onChange="action:age=__args[1].target.value"
            >
          <MenuItem value="10">Ten</MenuItem>
          <MenuItem value="20">Twenty</MenuItem>
          <MenuItem value="30">Thirty</MenuItem>
       </Select>
      </FormControl>`
        },
        {
            name: 'Slider',
            tag: 'Slider',
            properties: {'aria-label':"Volume", value:'expr:value', onChange:'action:value=__args[2]',  direction:['', 'row', 'column'], steps:'expr:0', max:'expr:100', min:'expr:0', 
                marks:`expr:[{value: 0,label: '0°C'}, {value: 20, label: '20°C'}, { value: 37, label: '37°C'}, { value: 100, label: '100°C'}]`}
        },
        {
            name: 'Checkbox',
            tag: 'Checkbox',
            properties:  {inputProps:["", "expr:{ 'aria-label': 'Checkbox demo' }"],  defaultChecked:["", "1"], disabled:["", "1"], checked:["", "1"]}
        },
        {
            name: 'CheckboxLabel',
            tag: 'FormControlLabel',
            properties: {control:["component:{Type:'Checkbox', defaultChecked:'1'}"], label:"label", disabled:['', '1']}
        },
        {
            name: 'Rating',
            tag:'Rating',
            properties: {value:'expr:value or 0', onChange:'action:value=__args[2]'}
        }
    ]
}