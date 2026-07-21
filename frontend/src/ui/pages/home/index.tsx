import { useCallback, useEffect, useRef, useState } from "react";
import Styles from "./style.module.css";
import Button from "../../components/button";
import GameCard from "../../components/game-card";
import Modal from "../../components/modal";
import ConfirmDialog from "../../components/confirm-dialog";
import PageHeader from "../../components/page-header";
import { useNavigate } from "react-router";
import { useApi } from "../../../hooks/use-api";
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";
import type CampaignsResponse from "../../../types/responses/campaigns";
import type PaginatedResponse from "../../../types/responses/paginated";

const PAGE_SIZE = 6;

export default function HomePage() {
  const navigate = useNavigate();
  const { getCampaigns, registerCampaign, updateCampaign, deleteCampaign } =
    useApi();
  const [campaigns, setCampaigns] = useState<CampaignsResponse[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<CampaignsResponse>, "content"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] =
    useState<CampaignsResponse | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<CampaignsResponse | null>(null);
  const [viewingCampaign, setViewingCampaign] =
    useState<CampaignsResponse | null>(null);
  const [form, setForm] = useState({ name: "", description: "", urlImage: "" });
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCampaigns = useCallback(async (q?: string, page?: number) => {
    setLoading(true);
    const data = await getCampaigns({
      q: q || undefined,
      page: page ?? 0,
      size: PAGE_SIZE,
    });
    if (data) {
      setCampaigns(data.content);
      const { content: _, ...paginationData } = data;
      setPagination(paginationData);
    }
    setLoading(false);
  }, [getCampaigns]);

  useEffect(() => {
    loadCampaigns(debouncedQuery, currentPage);
  }, [currentPage, debouncedQuery, loadCampaigns]);

  const handleSearch = useCallback((query: string) => {
    setCurrentPage(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
  }, []);

  const handleCreate = useCallback(async () => {
    setCreating(true);
    try {
      await registerCampaign({
        name: form.name,
        description: form.description,
        urlImage: form.urlImage || null,
      });
      setCreateModalOpen(false);
      setForm({ name: "", description: "", urlImage: "" });
      await loadCampaigns();
    } finally {
      setCreating(false);
    }
  }, [form, registerCampaign, loadCampaigns]);

  const openEdit = useCallback((campaign: CampaignsResponse) => {
    setEditingCampaign(campaign);
    setForm({
      name: campaign.name,
      description: campaign.description,
      urlImage: campaign.urlImage ?? "",
    });
    setEditModalOpen(true);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingCampaign) return;
    setSaving(true);
    try {
      await updateCampaign(editingCampaign.id, {
        name: form.name,
        description: form.description,
        urlImage: form.urlImage || null,
      });
      setEditModalOpen(false);
      setEditingCampaign(null);
      setForm({ name: "", description: "", urlImage: "" });
      await loadCampaigns();
    } finally {
      setSaving(false);
    }
  }, [editingCampaign, form, updateCampaign, loadCampaigns]);

  const handleDelete = useCallback(
    async (campaign: CampaignsResponse) => {
      setDeleteTarget(campaign);
    },
    [],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCampaign(deleteTarget.id);
      setDeleteTarget(null);
      setEditModalOpen(false);
      setEditingCampaign(null);
      setForm({ name: "", description: "", urlImage: "" });
      await loadCampaigns();
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, deleteCampaign, loadCampaigns]);

  return (
    <>
      <div className={Styles.main__content}>
        <main>
          <section>
            <div className={Styles.page__header}>
              <PageHeader
                title="Minhas Campanhas"
                description="Crie ou participe de uma campanha"
                onSearch={handleSearch}
                searchPlaceholder="Procurar campanhas..."
              />
            </div>
            <div className={Styles.page__actions}>
              <Button onClick={() => { setForm({ name: "", description: "", urlImage: "" }); setCreateModalOpen(true); }}>Nova Campanha</Button>
            </div>
          </section>
          <section>
            <div className={Styles.page__cards}>
              {loading ? (
                <p>Carregando...</p>
              ) : campaigns.length === 0 ? (
                <p>Nenhuma mesa encontrada. Crie uma nova mesa!</p>
              ) : (
                campaigns.map((campaign) => (
                  <GameCard
                    key={campaign.id}
                    title={campaign.name}
                    description={campaign.description}
                    imageUrl={campaign.urlImage ?? undefined}
                    owner={campaign.owner}
                    variant="featured"
                    onPlay={() => setViewingCampaign(campaign)}
                    onEdit={() => openEdit(campaign)}
                  />
                ))
              )}
            </div>
            {!loading && pagination && pagination.totalPages > 1 && (
              <div className={Styles.pagination}>
                <Button
                  variant="secondary"
                  size="small"
                  disabled={pagination.first}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <span className={Styles.paginationInfo}>
                  {currentPage + 1} de {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="small"
                  disabled={pagination.last}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Próximo
                </Button>
              </div>
            )}
          </section>
        </main>
      </div>

      <Modal
        isOpen={createModalOpen}
        toggleModal={setCreateModalOpen}
        title="Criar Nova Mesa"
        closeOnOutsideClick={true}
        draggable={false}
        size="medium"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minWidth: "300px",
          }}
        >
          <input
            placeholder="Nome da Mesa"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            minLength={3}
            maxLength={100}
          />
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
            maxLength={255}
            rows={3}
          />
          <input
            placeholder="URL da Imagem (opcional)"
            value={form.urlImage}
            onChange={(e) =>
              setForm((f) => ({ ...f, urlImage: e.target.value }))
            }
            maxLength={512}
          />
          <div className={Styles.modalActions}
            style={{ justifyContent: "flex-end" }}
          >
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={creating}>
              Criar
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        toggleModal={setEditModalOpen}
        title="Editar Mesa"
        closeOnOutsideClick={true}
        draggable={false}
        size="medium"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEdit();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minWidth: "300px",
          }}
        >
          <input
            placeholder="Nome da Mesa"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            minLength={3}
            maxLength={100}
          />
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
            maxLength={255}
            rows={3}
          />
          <input
            placeholder="URL da Imagem (opcional)"
            value={form.urlImage}
            onChange={(e) =>
              setForm((f) => ({ ...f, urlImage: e.target.value }))
            }
            maxLength={512}
          />
          <div className={Styles.modalActions}
            style={{ justifyContent: "space-between" }}
          >
            <Button
              variant="secondary"
              onClick={() => editingCampaign && handleDelete(editingCampaign)}
            >
              Excluir
            </Button>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={saving}>
                Salvar
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!viewingCampaign}
        toggleModal={() => setViewingCampaign(null)}
        title={viewingCampaign?.name || ""}
        closeOnOutsideClick={true}
        draggable={false}
        size="large"
      >
        {viewingCampaign && (
          <div className={Styles.viewContent}>
            <div className={Styles.viewImageWrapper}>
              {viewingCampaign.urlImage ? (
                <img
                  src={viewingCampaign.urlImage}
                  alt={viewingCampaign.name}
                  className={Styles.viewImage}
                />
              ) : (
                <div className={Styles.viewPlaceholder}>
                  <GiDiceTwentyFacesTwenty className={Styles.viewPlaceholderIcon} />
                </div>
              )}
            </div>
            <div className={Styles.viewBody}>
              <div className={Styles.viewField}>
                <span className={Styles.viewLabel}>Descrição:</span>
                <p className={Styles.viewDescription}>{viewingCampaign.description}</p>
              </div>
              {viewingCampaign.owner && (
                <div className={Styles.viewField}>
                  <span className={Styles.viewLabel}>Owner:</span>
                  <p className={Styles.viewOwner}>{viewingCampaign.owner}</p>
                </div>
              )}
              {viewingCampaign.createdAt && (
                <div className={Styles.viewField}>
                  <span className={Styles.viewLabel}>Criada em:</span>
                  <p className={Styles.viewOwner}>{new Date(viewingCampaign.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
                </div>
              )}
            </div>
            <div className={Styles.viewActions}>
              <Button
                variant="primary"
                size="large"
                onClick={() => navigate(`/app/map/${viewingCampaign.id}`)}
                className={Styles.viewPlayButton}
              >
                Play
              </Button>
              <Button
                variant="secondary"
                size="large"
                onClick={() => {
                  setViewingCampaign(null);
                  openEdit(viewingCampaign);
                }}
                className={Styles.viewEditButton}
              >
                Editar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Excluir Mesa"
        message={`Tem certeza que deseja excluir a mesa "${deleteTarget?.name}"?`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
      />
    </>
  );
}
