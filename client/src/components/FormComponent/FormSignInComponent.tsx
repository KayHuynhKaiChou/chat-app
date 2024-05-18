import {useForm} from 'react-hook-form'
import InputField from '../FormControls/InputField'
import { Button } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

interface FormSignInProps {
  handleSignIn : (values : Account) => void
}

function FormSignInComponent(props : FormSignInProps) {
  const {handleSignIn} = props
  
  const schema = yup.object({
    username: yup.string()
      .required('Please enter username !'),
    password: yup.string()
      .required('Please enter password !')
  });

  const form = useForm({
    defaultValues: {
      username : '',
      password : ''
    },
    resolver: yupResolver(schema)
  })

  return (
    <form onSubmit={form.handleSubmit(handleSignIn)}>
      <InputField name='username' label='Username' typeInput='text' form={form} />
      <InputField name='password' label='Password' typeInput='password' form={form} />
      <Button
        size='large'
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button> 
    </form>
  )
}

export default FormSignInComponent

