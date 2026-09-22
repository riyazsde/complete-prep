import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Icon } from '@iconify/react';
import { userApi } from '../../services/apiFunctions';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(-1);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

    const fetchFaqs = async () => {
      userApi.faq.getAll({
        setIsLoading,
        onSuccess: data => setFaqs(data?.data || []),
        onError: () => setFaqs([]),
      });
    };
  
    useEffect(() => {
      fetchFaqs();
    }, []);

  const skeletonItems = Array.from({ length: 4 });

  return (
    <>
      <div className="mainMaxWidth">
        <Header />

        <div className="px-3 md:px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Frequently Asked Questions ❓
            </h1>

            <p className="text-center text-gray-600 mb-10">
              Find answers to common questions about our platform and features.
            </p>

            <div className="space-y-4">
              {isLoading ? (
                skeletonItems.map((_, index) => (
                  <div
                    key={index}
                    className="rounded-lg md:p-4 p-3 bg-[#efefef] animate-pulse"
                  >
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                  </div>
                ))
              ) : faqs.length > 0 ? (
                faqs.map((faq, index) => {
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={index}
                      className="rounded-lg md:p-4 p-3 bg-[#efefef]"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      >
                        <h3 className="font-medium text-gray-800">
                          {faq.question}
                        </h3>

                        <div className="p-1">
                          {isOpen ? (
                            <Icon icon="line-md:minus" size={18} />
                          ) : (
                            <Icon icon="akar-icons:plus" size={18} />
                          )}
                        </div>
                      </div>

                      {isOpen && faq.answer && (
                        <div className="mt-4 text-gray-700 space-y-3">
                          <p className='whitespace-pre-line'>{faq.answer}</p>

                          {faq.link && (
                            <div
                              onClick={() => (window.location.href = '/contact')}
                              className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                            >
                              <span>{faq.link}</span>
                              <Icon icon="si:arrow-right-duotone" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg p-6 bg-[#efefef] text-center text-gray-600">
                  No FAQs available at the moment. Please check back later.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FaqPage;