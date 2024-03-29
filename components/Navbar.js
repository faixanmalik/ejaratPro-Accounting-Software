import { Fragment, useState } from 'react'
import Link from 'next/link'
import { Dialog, Popover, Tab, Transition, Menu, Listbox } from '@headlessui/react'
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BiUserCircle } from 'react-icons/bi';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router';



const products = {
  pages: [
    { name: 'Our Services', href: '/ourservices' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ],
}

const locales = [
  {
    id: 1,
    name: 'en',
    avatar: 'https://plus.unsplash.com/premium_photo-1674591172747-2c1d461d7b68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fHVzJTIwZmxhZ3xlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 2,
    name: 'ar',
    avatar: 'https://plus.unsplash.com/premium_photo-1675865395931-20d6782b28f9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHVhZSUyMGZsYWd8ZW58MHx8MHx8fDA%3D',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const router = useRouter();
  
  let getLocale = locales.filter((item)=>{
    return item.name === router.locale;
  })
  const [selected, setSelected] = useState(getLocale[0])



  return (
    <header className="bg-white">
      <div className='flex w-full items-center px-7 py-3'>

        <div className='flex space-x-7 rtl:space-x-reverse w-9/12 items-center'>
          <div className=''>
            <Link href={'/'}>
              <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt=""/>
            </Link>
          </div>

          <div className='flex space-x-5 rtl:space-x-reverse'>
            {products.pages.map((page) => (
              <Link key={page.name} href={page.href} className="flex no-underline items-center font-sans text-sm font-medium text-gray-700 hover:text-gray-800">{page.name}</Link>
            ))}
          </div>
        </div>

        <div className='flex items-center space-x-5 rtl:space-x-reverse'>

          <div>
            <Listbox value={selected} onChange={setSelected} >
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button className="relative w-28 cursor-default rounded-md bg-white py-1.5 px-2 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                      <div className='flex w-full'>
                        <div className='flex space-x-3 rtl:space-x-reverse w-9/12'>
                          <img src={selected.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                          <span className="block truncate">{selected.name.toUpperCase()}</span>
                        </div>
                        <div>
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                      </div>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute pl-0 z-10 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {locales.map((person) => (
                          <Link href={router.asPath} locale={person.name} className='no-underline'>
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                classNames(
                                  active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                  'relative cursor-default select-none py-2 px-2'
                                )
                              }
                              value={person}
                            >
                              {({ selected }) => (
                                <>
                                  <div className="flex space-x-3 rtl:space-x-reverse items-center">
                                    <img src={person.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" />
                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                      {person.name.toUpperCase()}
                                    </span>
                                  </div>

                                </>
                              )}
                            </Listbox.Option>
                          </Link>
                        ))}
                        {/* {router.locales.map((item, index)=>{
                          return <Link key={index} href={router.asPath} locale={item} className='text-2xl font-sans'>{item}</Link>
                        })} */}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>
          <div className='flex space-x-2 rtl:space-x-reverse'>
            <Link href={'/login'} className="text-sm font-bold text-black no-underline hover:text-gray-800">Sign in</Link>
            <span className="h-6 w-px bg-gray-800" aria-hidden="true" />
            <Link href={'/signup'} className="text-sm font-bold text-black no-underline hover:text-gray-800">Create account</Link>
          </div>
        </div>


      </div>
    </header>
  )
}
