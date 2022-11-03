function Modal({ visible, onClose }) {

    if (!visible) return null;



    return ( 
    <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center">
        <div className="bg-gray-800 text-white p-4 rounded-xl flex flex-col">
            <h1 className="bg-gray-800 text-2xl font-bold p-2">How to Use</h1>
            <div className="p-2 flex flex-col">
                <p className="">Enter the city, full state name (if applicable), and country.</p>
                <p className="">Include commas and the order matters.</p>
                <br></br>
                <p>(Examples: "Florence, IT" or "Claremont, California, US")</p>
                <br></br>
            </div>
            <button className="btn p-4" onClick={onClose}>Continue</button>
        </div>  
    </div>

     );
}

export default Modal;