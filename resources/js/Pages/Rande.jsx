import { Head } from "@inertiajs/react";
import BootstrapLayout from "@/Layouts/BootstrapLayout";
import { useState } from "react";

export default function Rande() {
    const [items, setItems] = useState([1]);
    const [color, setColor] = useState("blue");
    // 1. เพิ่ม State สำหรับเก็บตัวอักษร โดยเริ่มต้นที่ "A"
    const [letter, setLetter] = useState("A");

    const onPressButton = () => {
        // สุ่มสี
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor(randomColor);

        // 2. สุ่มตัวอักษร A-Z โดยใช้รหัส ASCII (65 คือ A, มีทั้งหมด 26 ตัวอักษร)
        const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        setLetter(randomLetter);
    };

    return (
        <BootstrapLayout>
            <div className="container">
                <Head title="Random" />
                <h1>Just imagin this is a random item</h1>
                <button className="btn btn-primary" onClick={onPressButton}> Change Color & Letter </button>
                <div className="row row-cols-1 row-cols-md-3 g-4 my-3">
                    {items.map((item, index) => (
                        <div className="col" key={index}>
                            <div style={{ backgroundColor: color, width: 100, height: 100 }} className="rounded-circle"></div>
                        </div>
                    ))}
                </div>
                
                <h1>{letter}</h1>                
            </div>
        </BootstrapLayout>
    );
}