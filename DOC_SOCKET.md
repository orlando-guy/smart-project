# 🔌 Documentation WebSockets (Socket.io)

Ce document explique l'implémentation et la consommation du temps réel au sein du monorepo SmartProject.

---

## 🏗️ 1. Côté API (Backend)

L'API utilise **Socket.io** pour gérer les communications bidirectionnelles. La logique est centralisée dans un service dédié.

### Architecture
- **Fichier** : `apps/api/src/services/socket.service.ts`
- **Pattern** : Singleton. Une seule instance gère l'ensemble des connexions du serveur.

### Initialisation
Le serveur Socket.io est greffé sur le serveur HTTP natif de Node.js dans `apps/api/src/app.ts` :
```typescript
const httpServer = createServer(app);
SocketService.getInstance().initialize(httpServer);
```

### Rooms & Sécurité
Pour garantir que les messages atteignent le bon destinataire, chaque utilisateur rejoint une "room" privée à la connexion :
1. Le client émet un événement `join` avec son `userId`.
2. Le serveur place la socket dans une room nommée d'après cet ID.

### Envoyer un message depuis le Backend
Pour envoyer une donnée en temps réel, injectez ou récupérez l'instance du `SocketService` :
```typescript
const socketService = SocketService.getInstance();
socketService.emitToUser(userId, 'nom_evenement', { donnee: 'valeur' });
```

---

## 💻 2. Côté Client (Frontend)

Le client utilise `socket.io-client` pour se connecter et écouter les mises à jour.

### Gestionnaire de connexion
- **Fichier** : `apps/client/features/notifications/infrastructure/socket/SocketClient.ts`
- **Pattern** : Singleton. Garantit qu'une seule connexion WebSocket est active par onglet.

### Consommer les événements (Exemple)
Pour écouter un événement, il est recommandé d'utiliser un Hook React pour gérer le cycle de vie de l'écouteur :

```typescript
useEffect(() => {
  const socket = SocketClient.getInstance().connect(user.id);
  
  if (socket) {
    socket.on('notification', (data) => {
      // Logique de traitement (ex: mise à jour du cache React Query)
    });
  }

  return () => {
    socket?.off('notification'); // Nettoyage impératif !
  };
}, [user.id]);
```

---

## 🚀 3. Intégrer une nouvelle fonctionnalité Temps Réel

Si vous souhaitez ajouter du temps réel à une nouvelle feature (ex: Messagerie, Mise à jour de tâche) :

### Étape A : Côté API
Ajoutez une méthode utilitaire dans le service concerné ou utilisez directement `SocketService` :
```typescript
// Dans votre service métier
this.socketService.emitToUser(targetId, 'task_updated', updatedTask);
```

### Étape B : Côté Client
1. Créez un hook `useFeatureSocket` dans le dossier `application/hooks` de votre feature.
2. Écoutez l'événement `task_updated`.
3. Utilisez `queryClient.setQueryData` pour mettre à jour l'UI instantanément sans requête HTTP supplémentaire.

---

## 🛠️ Débogage & Troubleshooting

1. **Vérification Serveur** : Vérifiez que l'API affiche `[Socket] Nouvel utilisateur connecté`.
2. **Vérification Client** : Vérifiez l'onglet **Network > WS** de votre navigateur. Vous devez voir une connexion `101 Switching Protocols`.
3. **Variable d'environnement** : Assurez-vous que `NEXT_PUBLIC_WS_URL` pointe bien vers `http://localhost:4000` (sans le suffixe `/api`).
