import Link from "next/link";

function Navbar() {
    return ( 
        <div className="navbar w-full flex justify-between p-2 bg-slate-100">
            <div className="navbar__logo w-3/5">
                <h1>Sudoku</h1>
            </div>
            <div className="navbar__menu w-2/5 flex justify-center">
                <ul>
                    <li>
                        <Link href="/history">history</Link>
                    </li>
                </ul>
            </div>
        </div>
     );
}

export default Navbar;