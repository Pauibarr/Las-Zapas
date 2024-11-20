import { Button, Card, CardBody, CardFooter, Dialog, Typography, Input} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { supabase } from "../bd/supabase";

export const Login = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((open) => !open);

    const [setSession] = GlobalContext();
    let navigate = useNavigate();

    const [dialogData, setDialogData] = useState({
    email: '', password: ''
    });

    async function handleSubmit(e) {
      e.preventDefault();
      try {
        let { data, error } = await supabase.auth.signInWithPassword({
          email: dialogData.email,
          password: dialogData.password
        });
        if (error) throw error;
        setSession(data.session);
        navigate('/');
      } catch (error) {
        console.error('Error logging in:', error.message);
        if (error.message.includes('Invalid login credentials')) {
          alert('Wrong email or password');
        } else {
          alert('Error logging in');
        }
      }
    }

    function handleChange(event) {
      setDialogData((prevDialogData) => ({
          ...prevDialogData,
          [event.target.name]: event.target.value
      }));
    }

    return(
      <>
      <Button onClick={handleOpen}>Login</Button>
      <Dialog size="xs" open={open} handler={handleOpen} className="bg-transparent shadow-none">
      <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
      <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
        <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4">Login</Typography>
              <Typography className="mb-3 font-normal text-gray-600 dark:text-gray-300" variant="paragraph">
                Enter your email and password to Login.
              </Typography>
              <Typography className="-mb-2" variant="h6">Your Email</Typography>
              <Input color="blue-gray" className="dark:text-gray-300" label="Email" size="lg" name="email" type="email" required onChange={handleChange}/>
              <Typography className="-mb-2" variant="h6">Your Password</Typography>
              <Input color="blue-gray" className="dark:text-gray-300" label="Password" size="lg" name="password" type="password" required autoComplete="current-password" onChange={handleChange}/>
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="gradient" fullWidth type="submit">Login</Button>
              <Typography variant="small" className="mt-4 flex justify-center">
                ¿Eres nuevo cliente?
              </Typography>
              <Link to="/registro"><Button color="white" size="lg" fullWidth type="submit">Registro</Button></Link>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
    )
}