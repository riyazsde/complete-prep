import { useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PdfFlipBook from '../../../components/ThirdParty/PdfFlipBook';
import { AuthContext } from '../../../Context/AuthContext';
import images from '../../../utils/images';

const HandWrittenNotesPage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { pdfUrl } = location.state || {};

  const { user, logout, isAuthenticated } = useContext(AuthContext);

  return (
    <div>
      <div className="bg-white text-white p-3 flex items-center justify-between gap-3">
        <img src={images.navBarLogo2} alt="Logo" className=" max-w-60 py-2 max-h-[60px] ml-4" onClick={()=> navigate("/user/home")} />
        <button className="bg-black text-white px-3 py-2 rounded-lg flex items-center gap-1" onClick={() => navigate(-1)}>
          <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-4 h-4 cursor-pointer"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
</svg>
          Back</button>
      </div>

      <div className="mainMaxWidth mx-auto mt-1">
        <div className="bg-white rounded-lg p-6 relative">
          <PdfFlipBook pdfPath={pdfUrl || '/flipbook/sample.pdf'} />
        </div>
      </div>
    </div>
  );
};

export default HandWrittenNotesPage2;
