import { Button, Card, CardBody, CardFooter, Dialog, Typography, Input} from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../bd/supabase";

export const Registro = () => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((open) => !open);

    const [dialogData, setDialogData] = useState({
      name: '', email: '', password: ''
    });

    async function handleSubmit(e) {
      e.preventDefault();
      try {
          let { data, error } = await supabase.auth.signUp({
              email: dialogData.email,
              password: dialogData.password,
              options: {
                  data: {
                      name: dialogData.name
                  }
              }
          });
          if (error) throw error;

          // console.log('User data:', data.user);

          const uid = data.user.id;

          const role = data.user.email === 'henareshidalgoruben@fpllefia.com' ? 'admin' : 'user';
          let { error: profileError } = await supabase.from('Profiles').insert([
              {
                  uid: uid,
                  email: data.user.email,
                  name_user: dialogData.name,
                  role: role,
                  created_at: new Date()
              }
          ]);
          if (profileError) throw profileError;

          alert('Register successfully');
      } catch (error) {
          console.error('Error:', error);
          alert(error.message);
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
      <Button onClick={handleOpen}>Registro</Button>
      <Dialog size="xs" open={open} handler={handleOpen} className="bg-transparent shadow-none">
      <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
      <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
        <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
          <form onSubmit={handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4">Registro</Typography>
              <Typography className="mb-3 font-normal text-gray-600 dark:text-gray-300" variant="paragraph">
                Enter your email and password to Login.
              </Typography>
              <Typography className="-mb-2" variant="h6">Name</Typography>
              <Input color="blue-gray" className="dark:text-gray-300" label="Name"size="lg"name="name"type="text"required onChange={handleChange}/>
              <Typography className="-mb-2" variant="h6">Your Email</Typography>
              <Input color="blue-gray" className="dark:text-gray-300" label="Email" size="lg" name="email" type="email" required onChange={handleChange}/>
              <Typography className="-mb-2" variant="h6">Your Password</Typography>
              <Input color="blue-gray" className="dark:text-gray-300" label="Password" size="lg" name="password" type="password" required autoComplete="current-password" onChange={handleChange}/>
              <Typography className="-mb-2" variant="h6">Comfirm Password</Typography>
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="gradient" fullWidth type="submit">Login</Button>
              <Typography variant="small" className="mt-4 flex justify-center">
                ¿Ya eres cliente?
              </Typography>
              <Link to="/login"><Button color="white" size="lg" fullWidth type="submit">Login</Button></Link>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
    )
}