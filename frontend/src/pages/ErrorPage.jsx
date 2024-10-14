import { Link } from 'react-router-dom';

import XSvg from './../assets/svgs/X';

const ErrorPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col h-screen p-10">
      <div className="flex-1 flex items-center  justify-center">
        <XSvg className="w-20 sm:w-1/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col  items-center pt-5">
        <h1>Something went wrong!</h1>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};
export default ErrorPage;
