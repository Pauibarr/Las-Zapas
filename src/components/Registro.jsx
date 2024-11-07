import { Button, Card, CardBody, CardFooter, Dialog, Typography, Input} from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Registro = () => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((open) => !open);
    return(
      <>
      <Button onClick={handleOpen}>Registro</Button>
      <Dialog size="xs" open={open} handler={handleOpen} className="bg-transparent shadow-none">
      <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
      <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
        <Card className="dark:bg-blue-gray-900 dark:text-white mx-auto w-full max-w-[24rem]">
          <form>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4">Login</Typography>
              <Typography className="mb-3 font-normal text-gray-600 dark:text-gray-300" variant="paragraph">
                Enter your email and password to Login.
              </Typography>
              <Typography className="-mb-2" variant="h6">Your Email</Typography>
              <Input color="blue-gray" className="dark:text-gray-300" label="Email" size="lg" name="email" type="email" required />
              <Typography className="-mb-2" variant="h6">Your Password</Typography>
              <Input color="blue-gray" className="dark:text-gray-300" label="Password" size="lg" name="password" type="password" required autoComplete="current-password" />
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