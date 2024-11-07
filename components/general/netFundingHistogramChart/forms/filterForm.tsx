import DualRangeSliderWithTippy from '@/components/UI/dualRangeSliderWithTippy';

export default function FilterForm () {
  const titles = [
    'Volatility - 252',
    'Subscription period',
    'Redemption period',
    'Net Assets',
    'Shareholder quantity',
  ];
  return (
    <div className='relative p-4 flex flex-col lg:flex-row items-start lg:items-stretch gap-4 lg:gap-12'>
      <h3 className='ml-6 mb-2 lg:ml-0 text-lg px-2'>Filters:</h3>
      <div className='w-full flex flex-col items-center gap-4 lg:gap-8 lg:w-fit lg:items-center justify-center'>
      {
        titles.map((title) => {
          return (
            <div className='flex flex-col w-fit'>
              <h4 className='mb-2 px-1 lg:m-0 lg:relative top-1'>
                {title}
              </h4>
              <DualRangeSliderWithTippy />
            </div>
          )
        })
      }
      </div>
      <div className='hidden lg:flex ml-8'>
        <div className='flex px-4 items-center border-l-2 hover:border-yellow-600 hover:text-yellow-600 transition-all duration-300 hover:cursor-pointer'>
          <span>Apply</span>
        </div>
      </div>
    </div>
  );
};
