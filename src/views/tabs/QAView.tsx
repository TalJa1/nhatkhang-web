import Sidebar from "../../components/Sidebar";

const QAView = () => {
  const QAViewContent = () => {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Hỏi đáp</h1>
        <p>Chức năng này sẽ sớm được cập nhật!</p>
      </div>
    );
  };

  return <Sidebar children={<QAViewContent />} />;
};

export default QAView;
