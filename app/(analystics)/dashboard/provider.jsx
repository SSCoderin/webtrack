import Header from "../Components/Header";
export default function DashboardProvider({children}){
    return (
        <>
        <Header/>
        {children}
        </>
    )
}