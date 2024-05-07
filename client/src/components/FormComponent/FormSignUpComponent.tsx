import {useForm} from 'react-hook-form'
import InputField from '../FormControls/InputField'
import { Button } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

interface FormSignUpProps {
  handleSignUp : (values : User) => void
}

function FormSignUpComponent(props : FormSignUpProps) {
  const {handleSignUp} = props
  
  const schema = yup.object({
    username: yup.string()
      .required('Please enter username !')
      .min(6 , 'Username contains at least 6 characters !'),
    email: yup.string()
      .required('Please enter Email !')
      .email('Email is wrong format !'),
    password: yup.string()
      .required('Please enter password !')
      .matches(/^[A-Z]/, 'Password must start with an uppercase letter')
      .min(8 , 'Password contains at least 8 characters !'),
    confirmPassword : yup.string()
      .required('Please enter confirmPassword !')
      .oneOf([yup.ref('password'), ''], 'PasswordCofirm must match to Password')
  });

  const form = useForm({
    defaultValues: {
      username : '',
      email : '',
      password : '',
      confirmPassword : ''
    },
    resolver: yupResolver(schema)
  })

  return (
    <form onSubmit={form.handleSubmit(handleSignUp)}>
      <InputField name='username' label='Username' typeInput='text' form={form} />
      <InputField name='email' label='Email' typeInput='text' form={form} />
      <InputField name='password' label='Password' typeInput='password' form={form} />
      <InputField name='confirmPassword' label='ConfirmPassword' typeInput='password' form={form} />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign Up
      </Button> 
    </form>
  )
}

export default FormSignUpComponent

