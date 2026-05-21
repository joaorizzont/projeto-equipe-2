import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormField } from '../FormField/FormField';
import { Spinner } from '../Spinner/Spinner';
import { Toast } from '../Toast/Toast';
import { eventsApi } from '../../api/events/EventsApi';
import type { EventResponse } from '../../api/response-types/EventResponse';
import { Calendar, Tag, Image, Archive, MapPin, AlignLeft, DollarSign, Globe, ArrowLeft, Save } from 'lucide-react';

interface EventFormProps {
  event?: EventResponse;
  onSuccess?: () => void;
  onClose?: () => void;
}

const formatToDatetimeLocal = (isoString?: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
};

export const EventForm: React.FC<EventFormProps> = ({ event: propEvent, onSuccess, onClose }) => {
  const { id: urlId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!urlId || !!propEvent;

  // Estados dos campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [defaultStock, setDefaultStock] = useState('100');
  const [validAt, setValidAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [location, setLocation] = useState('');
  const [format, setFormat] = useState('Presencial');
  const [imageUrl, setImageUrl] = useState('');

  // Estados de controle e feedback
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

  // Carrega dados se for modo edição
  useEffect(() => {
    const loadEvent = async () => {
      const targetId = urlId || propEvent?.id;
      if (!targetId) return;

      try {
        setInitialLoading(true);
        const data = await eventsApi.findById(targetId);
        setTitle(data.title);
        setDescription(data.description || '');
        setPrice(data.price !== undefined ? String(data.price) : '0');
        setDefaultStock(String(data.defaultStock));
        setValidAt(formatToDatetimeLocal(data.validAt));
        setEndAt(data.endAt ? formatToDatetimeLocal(data.endAt) : '');
        setLocation(data.location || '');
        setFormat(data.format || 'Presencial');
        setImageUrl(data.imageUrl || '');
      } catch (err: any) {
        setToastType('error');
        setToastMessage('Erro ao carregar os dados do evento.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadEvent();
  }, [urlId, propEvent]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'O título do evento é obrigatório.';
    }

    const stockNum = Number(defaultStock);
    if (!defaultStock || isNaN(stockNum) || stockNum < 1) {
      newErrors.defaultStock = 'A capacidade deve ser um número maior ou igual a 1.';
    }

    const priceNum = Number(price);
    if (price === '' || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = 'O preço deve ser maior ou igual a R$ 0,00.';
    }

    if (!validAt) {
      newErrors.validAt = 'A data de início do evento é obrigatória.';
    } else {
      const selectedDate = new Date(validAt);
      if (selectedDate.getTime() < Date.now() && !isEditMode) {
        newErrors.validAt = 'A data do evento não pode ser no passado.';
      }
    }

    if (validAt && endAt) {
      const start = new Date(validAt);
      const end = new Date(endAt);
      if (end.getTime() <= start.getTime()) {
        newErrors.endAt = 'A data de término deve ser após a data de início.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      const isoDate = new Date(validAt).toISOString();
      const isoEndDate = endAt ? new Date(endAt).toISOString() : undefined;
      const targetId = urlId || propEvent?.id;

      const payload = {
        title: title.trim(),
        defaultStock: Number(defaultStock),
        validAt: isoDate,
        imageUrl: imageUrl.trim() || undefined,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        format: format,
        endAt: isoEndDate,
        price: Number(price),
      };

      if (isEditMode && targetId) {
        await eventsApi.update(targetId, payload);
        setToastType('success');
        setToastMessage('Evento atualizado com sucesso!');
      } else {
        await eventsApi.create(payload);
        setToastType('success');
        setToastMessage('Evento criado com sucesso!');
      }

      setTimeout(() => {
        if (onSuccess) onSuccess();
        if (onClose) onClose();
        navigate('/eventos');
      }, 1500);
    } catch (err: any) {
      const apiErrorMessage = err?.response?.data?.message || 'Ocorreu um erro ao salvar o evento.';
      setToastType('error');
      setToastMessage(apiErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/eventos');
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Top Bar com botão voltar */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-950 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isEditMode ? 'Editar Evento' : 'Criar Evento'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isEditMode
              ? 'Faça as alterações necessárias nas informações do evento.'
              : 'Insira os dados para cadastrar um novo evento na plataforma.'}
          </p>
        </div>
      </div>

      {/* Formulário estruturado em Blocos */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        
        {/* Bloco 1: Informações Básicas */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Tag size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Informações Básicas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Título do Evento"
                placeholder="Ex: Conferência Nacional de Tecnologia"
                value={title}
                onChange={(val) => {
                  setTitle(val);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                error={errors.title}
                required
                disabled={loading}
                icon={<Tag size={18} />}
              />
            </div>

            <FormField
              label="Preço Base (R$)"
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(val) => {
                setPrice(val);
                if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
              }}
              error={errors.price}
              disabled={loading}
              icon={<DollarSign size={18} />}
            />
          </div>

          {/* Descrição em Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Descrição do Evento
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-4 text-slate-400">
                <AlignLeft size={18} />
              </div>
              <textarea
                placeholder="Conte detalhes sobre o evento, atrações, cronograma..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                rows={4}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Bloco 2: Localização e Formato */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <MapPin size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Localização e Formato</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <FormField
                label="Nome do Local ou Endereço"
                placeholder="Ex: Av. Paulista, 1000 ou Online"
                value={location}
                onChange={setLocation}
                disabled={loading}
                icon={<MapPin size={18} />}
              />
            </div>

            {/* Dropdown de Formato */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Formato
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Globe size={18} />
                </div>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Online">Online</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 3: Data, Hora e Ingressos */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Calendar size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Data, Hora e Capacidade</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="Data e Hora de Início"
              type="datetime-local"
              value={validAt}
              onChange={(val) => {
                setValidAt(val);
                if (errors.validAt) setErrors((prev) => ({ ...prev, validAt: '' }));
              }}
              error={errors.validAt}
              required
              disabled={loading}
              icon={<Calendar size={18} />}
            />

            <FormField
              label="Data e Hora de Término"
              type="datetime-local"
              value={endAt}
              onChange={(val) => {
                setEndAt(val);
                if (errors.endAt) setErrors((prev) => ({ ...prev, endAt: '' }));
              }}
              error={errors.endAt}
              disabled={loading}
              icon={<Calendar size={18} />}
            />

            <FormField
              label="Capacidade Total"
              type="number"
              placeholder="Ex: 500"
              value={defaultStock}
              onChange={(val) => {
                setDefaultStock(val);
                if (errors.defaultStock) setErrors((prev) => ({ ...prev, defaultStock: '' }));
              }}
              error={errors.defaultStock}
              required
              disabled={loading}
              icon={<Archive size={18} />}
            />
          </div>
        </div>

        {/* Bloco 4: Capa do Evento */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Image size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Capa do Evento</h3>
          </div>

          <FormField
            label="URL da Imagem de Capa"
            placeholder="Ex: https://meusite.com/imagem-evento.jpg"
            value={imageUrl}
            onChange={setImageUrl}
            disabled={loading}
            icon={<Image size={18} />}
          />
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.35)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none min-w-[150px] cursor-pointer"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Save size={18} />
                {isEditMode ? 'Salvar Alterações' : 'Publicar Evento'}
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
