
import React from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { CheckCircle, XCircle } from 'lucide-react';

interface ReviewFormProps {
  reviewNotes: string;
  onNotesChange: (notes: string) => void;
  demoStatus: string;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  reviewNotes,
  onNotesChange,
  demoStatus,
  onApprove,
  onReject,
  onCancel
}) => {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Feedback do Revisor</h3>
        <Textarea
          value={reviewNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Adicione notas ou feedback para o artista"
          className="h-24 bg-black/20 border-white/10"
        />
      </div>
      
      <div className="flex space-x-4">
        <Button
          onClick={onApprove}
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={demoStatus === 'approved'}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Aprovar
        </Button>
        <Button
          onClick={onReject}
          className="flex-1 bg-red-600 hover:bg-red-700"
          disabled={demoStatus === 'rejected'}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Rejeitar
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </>
  );
};

export default ReviewForm;
