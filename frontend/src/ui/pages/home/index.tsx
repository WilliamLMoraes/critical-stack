import { useCallback, useEffect, useState } from "react";
import Styles from "./style.module.css";
import Button from "../../components/button";
import GameCard from "../../components/game-card";
import Modal from "../../components/modal";
import ConfirmDialog from "../../components/confirm-dialog";
import { useNavigate } from "react-router";
import Container from "../../components/container";
import { useApi } from "../../../hooks/use-api";
import type CampaignsResponse from "../../../types/responses/campaigns";

export default function HomePage() {
  const navigate = useNavigate();
  const { getCampaigns, registerCampaign, updateCampaign, deleteCampaign } =
    useApi();
  const [campaigns, setCampaigns] = useState<CampaignsResponse[]>([]);
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
  const [form, setForm] = useState({ name: "", description: "", urlImage: "" });

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    const data = await getCampaigns();
    if (data) setCampaigns(data);
    setLoading(false);
  }, [getCampaigns]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

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
      await loadCampaigns();
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, deleteCampaign, loadCampaigns]);

  return (
    <Container>
      <div className={Styles.main__content}>
        <main>
          <div className={Styles.page}>
            <section>
              <div className={Styles.page__header}>
                <h1>Minhas Mesas:</h1>
                <div>
                  <Button onClick={() => setCreateModalOpen(true)}>Criar Mesa</Button>
                </div>
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
                      variant="featured"
                      onPlay={() => navigate(`/map/${campaign.id}`)}
                      onEdit={() => openEdit(campaign)}
                      onDelete={() => handleDelete(campaign)}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        </main>

        <footer className={Styles.footer}>
          <div>
            <div className={Styles.footer__container}>
              <p>Critical Stack - 2026</p>
            </div>
          </div>
        </footer>
      </div>

      <Modal
        isOpen={createModalOpen}
        toggleModal={setCreateModalOpen}
        title="Criar Nova Mesa"
        closeOnOutsideClick={true}
        draggable={false}
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
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
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

      <Modal
        isOpen={editModalOpen}
        toggleModal={setEditModalOpen}
        title="Editar Mesa"
        closeOnOutsideClick={true}
        draggable={false}
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
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={saving}>
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </Container>
  );
}
