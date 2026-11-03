          />
          <Campo
            label="SENHA"
            placeholder="Mínimo 6 caracteres"
            icon="🔒"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.sectionTitle}>ENDEREÇO</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Campo
                label="CEP"
                placeholder="00000-000"
                icon="⌖"
                value={cep}
                onChangeText={setCep}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.column}>
              <Campo
                label="ESTADO"
                placeholder="UF"
                icon="▣"
                value={estado}
                onChangeText={setEstado}
              />
            </View>
          </View>
          <Campo
            label="CIDADE"
            placeholder="Sua cidade"
            icon="▦"
            value={cidade}
            onChangeText={setCidade}
          />
          <Campo
            label="ENDEREÇO"
            placeholder="Rua, número, bairro"
            icon="⌂"
            value={endereco}
            onChangeText={setEndereco}
          />

          <TouchableOpacity
            style={[styles.submitButton, carregando && styles.disabledButton]}
            onPress={handleCadastro}
            disabled={carregando}
            activeOpacity={0.85}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>CADASTRAR ONG</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onLogin} style={styles.loginLink}>
            <Text style={styles.loginText}>
              Já possui uma conta? <Text style={styles.loginHighlight}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const GREEN = "#348F43";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { flexGrow: 1, paddingBottom: 32 },
  header: {
    backgroundColor: GREEN,
    minHeight: 248,
    paddingHorizontal: 28,
    paddingTop: 42,
    paddingBottom: 28,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  backText: { color: "#FFFFFF", fontSize: 38, lineHeight: 40, marginTop: -5 },
  logoCircle: {
    marginTop: 14, width: 54, height: 54, borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
  },
  logo: { fontSize: 25 },
  title: { color: "#FFFFFF", fontSize: 24, fontWeight: "500", marginTop: 14 },
  subtitle: { color: "#DCEFE0", fontSize: 14, marginTop: 5 },
  form: { paddingHorizontal: 24, paddingTop: 28 },
  sectionTitle: {
    color: "#6F9476", fontSize: 13, letterSpacing: 0.5,
    marginTop: 2, marginBottom: 18,
    borderBottomWidth: 1, borderBottomColor: "#E8EEE9", paddingBottom: 7,
  },
  fieldGroup: { marginBottom: 16, flex: 1 },
  label: { color: "#242824", fontSize: 13, marginBottom: 8, fontWeight: "500" },
  inputContainer: {
    minHeight: 49, backgroundColor: "#F3F8F4", borderRadius: 7,
    flexDirection: "row", alignItems: "center", paddingHorizontal: 14,
  },
  inputIcon: { width: 28, color: "#8B9890", fontSize: 18 },
  input: { flex: 1, color: "#28332B", fontSize: 15, paddingVertical: 12 },
  twoColumns: { flexDirection: "row", gap: 14 },
  column: { flex: 1 },
  submitButton: {
    backgroundColor: GREEN, minHeight: 52, borderRadius: 8,
    alignItems: "center", justifyContent: "center", marginTop: 12,
  },
  disabledButton: { opacity: 0.65 },
  submitText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },
  loginLink: { alignItems: "center", paddingVertical: 20 },
  loginText: { color: "#777F79", fontSize: 14 },
  loginHighlight: { color: GREEN, fontWeight: "700" },
});
