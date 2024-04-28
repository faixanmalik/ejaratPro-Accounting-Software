import { useState , useEffect } from 'react'
import '@/styles/globals.css'
import "../styles/style.scss";

// React top loading bar
import LoadingBar from 'react-top-loading-bar'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { useRouter } from 'next/router';


export default function App({ Component, pageProps }) {

  const router = useRouter();

  //  react top loading bar
  const [progress, setProgress] = useState(0)
  const [user, setUser] = useState({value: null})
  const [userEmail, setUserEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [key, setKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [dbUser, setDbUser] = useState('')
  //  Use Effect for routerChange
  useEffect(() => {

    router.events.on('routeChangeStart', ()=>{
      setProgress(75);
    });
    router.events.on('routeChangeComplete', ()=>{
      setProgress(100);
    }, []);

    let myUser = JSON.parse(localStorage.getItem("myUser"));
    if( myUser ){
      setUserEmail(myUser.businessName);
      setBusinessName(myUser.businessName);
      setUser({value: myUser.token , email: myUser.email, name: myUser.name, department: myUser.department });
      setKey(Math.random());
    }
    
  }, [router.query, userEmail])


  useEffect(() => {

    async function fetchData() {
      let getUser = JSON.parse(localStorage.getItem("myUser"));
      if(getUser){

        let token = getUser.token;
      
        const data = { token };
        let res = await fetch(`/api/getuser`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        let response = await res.json()
        if(response.success === true){
          setDbUser(response.dbuser)
        }
      }
    }
    
    fetchData();
  }, [])



  // Logout function
  const logout = ()=>{
    localStorage.removeItem("myUser");
    setUser({value:null});
    setKey(Math.random());
    router.push(`/login`);
  }


  return <>
    {router.locale === 'en' ? (
  isLoading === true ? (
    <div className="grid min-h-screen w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
      <svg className="w-16 h-16 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"></path>
      </svg>
    </div>
  ) : (
    <div dir='ltr'>
      <Navbar key={key} user={user} logout={logout} />
      <LoadingBar
        color='#0800FF'
        height={3}
        progress={progress}
        waitingTime={300}
        onLoaderFinished={() => setProgress(0)}
      />
      <Component {...pageProps} locale={router.locale} isLoading={isLoading} setIsLoading={setIsLoading} businessName={dbUser.businessName} userEmail={dbUser.businessName} />
      <Footer />
    </div>
  )
) : (
  isLoading === true ? (
    <div className="grid min-h-screen w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
      <svg className="w-16 h-16 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <path d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"></path>
      </svg>
    </div>
  ) : (
    <div dir='rtl'>
      <Navbar key={key} user={user} logout={logout} />
      <LoadingBar
        color='#0800FF'
        height={3}
        progress={progress}
        waitingTime={300}
        onLoaderFinished={() => setProgress(0)}
      />
      <Component {...pageProps} locale={router.locale} setIsLoading={setIsLoading} businessName={dbUser.businessName} userEmail={dbUser.businessName} />
      <Footer />
    </div>
  )
)}
    
  </>
}
