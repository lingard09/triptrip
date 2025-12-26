import { useState } from "react";
import { X, Save, Trash2 } from "lucide-react";
import type { Place } from "../types";

interface PlaceModalProps {
  place: Partial<Place> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (place: Omit<Place, "id" | "createdAt" | "updatedAt">) => void;
  onDelete?: (id: string) => void;
}

export function PlaceModal({
  place,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: PlaceModalProps) {
  const [name, setName] = useState(place?.name || "");
  const [memo, setMemo] = useState(place?.memo || "");
  const [category, setCategory] = useState(place?.category || "");

  if (!isOpen || !place) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert("장소 이름을 입력해주세요.");
      return;
    }

    onSave({
      name: name.trim(),
      memo: memo.trim(),
      category: category.trim(),
      lat: place.lat!,
      lng: place.lng!,
    });

    onClose();
  };

  const handleDelete = () => {
    if (place.id && onDelete) {
      if (confirm("이 장소를 삭제하시겠습니까?")) {
        onDelete(place.id);
        onClose();
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{place.id ? "장소 수정" : "장소 추가"}</h2>
          <button className="icon-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>장소 이름 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 서울역"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>카테고리</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="예: 맛집, 카페, 관광지"
            />
          </div>

          <div className="form-group">
            <label>메모</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>위치</label>
            <div className="location-info">
              위도: {place.lat?.toFixed(6)}, 경도: {place.lng?.toFixed(6)}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {place.id && onDelete && (
            <button className="button button-danger" onClick={handleDelete}>
              <Trash2 size={16} />
              삭제
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="button button-secondary" onClick={onClose}>
            취소
          </button>
          <button className="button button-primary" onClick={handleSave}>
            <Save size={16} />
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
