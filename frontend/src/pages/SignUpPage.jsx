import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import fetchUrl from '../utils/axios';
import XSvg from './../assets/svgs/X';
import {
  MdOutlineMail,
  MdPassword,
  MdDriveFileRenameOutline,
} from 'react-icons/md';
import { FaUser } from 'react-icons/fa';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
  });

  const queryClient = useQueryClient();

  // Use Mutation for signing up
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const { data, status } = await fetchUrl.post('/auth/signup', {
          email,
          username,
          fullName,
          password,
        });

        if (status !== 201) {
          throw new Error(
            data.error?.response?.data?.message || 'Failed to create account'
          );
        }
        console.log(data);
        return data;
      } catch (err) {
        console.log('Error 💥', err.response?.data?.message || err.message);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Created profile successfully');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (err) => {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Something went wrong! ${errorMessage}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
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
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
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
            {isPending ? 'Loading...' : 'Sign up'}
          </button>

          {isError && (
            <p className="text-red-500">
              {error?.response?.data?.message ||
                error?.message ||
                'An unexpected error occurred'}
            </p>
          )}
        </form>

        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
