import { Controller } from 'react-hook-form'
import { TextField } from '@mui/material'

interface InputFieldProps {
    form: any,
    name: string,
    label: string,
    typeInput: string,
    disabled?: boolean
}

function InputField(props : InputFieldProps) {
    const {
        form,
        name,
        label,
        disabled,
        typeInput
    } = props
    const {formState : {errors}} = form;
    const hasError = errors[name]; // thằng này sẽ lưu kiểu boolean do đó ta cần thêm !!

    return (
        <Controller
            name={name}
            control={form.control}
            render={({field}) => 
                <TextField 
                    {...field} 
                    margin="normal"
                    label={label}
                    type={typeInput}
                    fullWidth
                    error={!!hasError}
                    helperText={errors[name]?.message}
                />
            }
        />
    )
}


export default InputField

