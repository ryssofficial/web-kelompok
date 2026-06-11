import { StyledButton, HappyHuesTheme } from "../BaseComponents";

export const SubmitButton = ({ handleSubmit }) => (
    <StyledButton 
        label="Simpan Data Siswa" 
        type="secondary" 
        fullWidth={true} 
        padding="16px 20px" 
        onClick={handleSubmit}
        style={{ marginTop: '20px' }}  
    />
);