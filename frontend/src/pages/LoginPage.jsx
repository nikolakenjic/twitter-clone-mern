import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import fetchUrl from '../utils/axios';
import toast from 'react-hot-toast';

import XSvg from './../assets/svgs/X';

import { MdOutlineMail } from 'react-icons/md';
import { MdPassword } from 'react-icons/md';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const queryClient = useQueryClient();

  // Use Mutation for Login
  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const { data, status } = await fetchUrl.post('/auth/login', {
          email,
          password,
        });

        if (status !== 200) {
          throw new Error(
            data.error?.response?.data?.message || 'Failed to create account'
          );
        }

        return data;
      } catch (err) {
        console.log('Error 💥', err.response?.data?.message || err.message);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Login successfully');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Something went wrong! ${errorMessage}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? 'Loading...' : 'Login'}
          </button>

          {isError && (
            <p className="text-red-500">
              {error?.response?.data?.message ||
                error?.message ||
                'An unexpected error occurred'}
            </p>
          )}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
