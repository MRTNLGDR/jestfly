
import React from 'react';
import { Button } from '../../ui/button';

interface ActionButtonsProps {
  onSave: () => void;
  onDelete: () => void;
  loading: boolean;
  hasSelectedModel: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onDelete,
  loading,
  hasSelectedModel
}) => {
  return (
    <div className="col-span-full flex gap-2 mt-6">
      <Button 
        onClick={onSave} 
        className="flex-1" 
        disabled={loading}
        variant="default"
      >
        {loading ? 'Salvando...' : hasSelectedModel ? 'Atualizar Modelo' : 'Salvar Modelo'}
      </Button>
      
      {hasSelectedModel && (
        <Button 
          onClick={onDelete} 
          variant="destructive" 
          disabled={loading}
        >
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
