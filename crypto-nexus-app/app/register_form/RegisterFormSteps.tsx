"use client";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { updateUserProfile } from "@/lib/apiService";
import { useRouter } from "next/navigation";

export default function RegisterFormSteps() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre_completo: "",
    fecha_nacimiento: "",
    pais_residencia: "bolivia",
    ciudad_residencia: "",
    nacionalidad: "boliviano",
    tipo_documento: "id",
    documento_identidad: "",
    numero_telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNext = async () => {
    if (step < 3) setStep(step + 1);
    else await handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      const res = await updateUserProfile(formData);
      alert(res.message || "Datos guardados correctamente");
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al guardar datos");
    }
  };

  return (
    <>
      <ProgressBar step={step} />
      <form id="registerForm" onSubmit={(e) => e.preventDefault()}>
        {step === 1 && (
          <div className="form-step active">
            <div className="form-group welcome-message">
              <h3>Bienvenido</h3>
              <p>Por favor, ingresa tu información personal para completar el registro.</p>
            </div>

            <div className="form-group">
              <label htmlFor="nombre_completo">Nombre Completo</label>
              <input
                type="text"
                id="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pais_residencia">País de Residencia</label>
              <select
                id="pais_residencia"
                value={formData.pais_residencia}
                onChange={handleChange}
              >
                <option value="bolivia">🇧🇴 Bolivia</option>
                <option value="argentina">🇦🇷 Argentina</option>
                <option value="peru">🇵🇪 Perú</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ciudad_residencia">Ciudad de Residencia</label>
              <input
                type="text"
                id="ciudad_residencia"
                value={formData.ciudad_residencia}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="button" onClick={handleNext}>Siguiente</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step active">
            <div className="form-group">
              <label htmlFor="nacionalidad">Nacionalidad</label>
              <select
                id="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                required
              >
                <option value="boliviano">Boliviano</option>
                <option value="argentino">Argentino</option>
                <option value="peruano">Peruano</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tipo_documento">Tipo de Documento</label>
              <select
                id="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                required
              >
                <option value="id">ID</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="documento_identidad">Número de Documento</label>
              <input
                type="text"
                id="documento_identidad"
                value={formData.documento_identidad}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numero_telefono">Número de Teléfono</label>
              <input
                type="tel"
                id="numero_telefono"
                value={formData.numero_telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="button" onClick={handleBack}>Atrás</button>
              <button type="button" onClick={handleNext}>Siguiente</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step active">
            <h2 className="form-group welcome-message">Registro completo</h2>
            <p className="form-group welcome-message">
              ¡Gracias por registrarte! Ahora puedes acceder a tu cuenta.
            </p>
            <div className="form-buttons">
              <button type="button" onClick={handleSubmit}>Ir a tu cuenta</button>
            </div>
          </div>
        )}
      </form>
    </>
  );
}
