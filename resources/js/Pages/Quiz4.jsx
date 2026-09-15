import BootstrapLayout from "@/Layouts/BootstrapLayout";
import React, { useState, useEffect } from "react";

const Quiz4 = () => {
    const [fishes, setFishes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/fishes')
            .then((response) => response.json())
            .then((data) => {
                setFishes(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching fish data:', error);
                setLoading(false);
            });
    }, []);

    return (
        <BootstrapLayout>
            <div className="container my-4">
                <h1 className="mb-4 text-primary">🐟 รายชื่อและข้อมูลสายพันธุ์ปลา (Quiz 4)</h1>
                
                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : (
                    <div className="table-responsive shadow-sm rounded">
                        <table className="table table-striped table-hover table-bordered align-middle mb-0">
                            <thead className="table-primary">
                                <tr>
                                    <th scope="col" className="text-center">#</th>
                                    <th scope="col">ชื่อปลา</th>
                                    <th scope="col">ชื่อวิทยาศาสตร์</th>
                                    <th scope="col">ประเภทน้ำ</th>
                                    <th scope="col" className="text-end">ขนาดเฉลี่ย (ซม.)</th>
                                    <th scope="col" className="text-end">อายุขัยเฉลี่ย (ปี)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fishes.length > 0 ? (
                                    fishes.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <th scope="row" className="text-center">{index + 1}</th>
                                            <td className="fw-bold text-dark">{item.name}</td>
                                            <td className="fst-italic text-secondary">{item.scientific_name}</td>
                                            <td>
                                                <span className={`badge ${
                                                    item.water_type === 'น้ำเค็ม' ? 'bg-info' :
                                                    item.water_type === 'น้ำจืด' ? 'bg-success' : 'bg-warning text-dark'
                                                }`}>
                                                    {item.water_type}
                                                </span>
                                            </td>
                                            <td className="text-end">{item.avg_size_cm}</td>
                                            <td className="text-end">{item.lifespan_years}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            ไม่พบข้อมูลปลาในระบบ
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </BootstrapLayout>
    );
};

export default Quiz4;