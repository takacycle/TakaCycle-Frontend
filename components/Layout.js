// components/Layout.js
import Navbar from '@/components/Navbar'

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
                {children}
            </main>
        </div>
    );
};

export default Layout;
