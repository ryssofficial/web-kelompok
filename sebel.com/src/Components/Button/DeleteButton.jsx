import { StyledButton, HappyHuesTheme } from "../BaseComponents";

export const DeleteButton = ({ id, onDelete }) => (
    <StyledButton 
        label="🗑️ Hapus"
        color={HappyHuesTheme.tertiary} 
        padding="6px 12px" 
        fontSize="12px" 
        onClick={() => onDelete(id)}
    />
);